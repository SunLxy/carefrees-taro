import type { IPluginContext } from '@tarojs/service';
import fastGlob from 'fast-glob';
import path from 'path';
import FS from 'fs-extra';
import chokidar from 'chokidar';

export class ModelInstance {
  /**model 存储路径 */
  modelsPaths: Map<string, boolean> = new Map([]);
  isTs?: boolean;
  cwd?: string;
  constructor() {
    this.cwd = path.join(process.cwd(), 'src');
    const list = fastGlob.sync(
      [
        '!**/node_modules/**',
        '!node_modules/**',
        '**/models/*.{ts,js}',
        '**/models/**/*.{ts,js}',
        'models/*.{ts,js}',
        'models/**/*.{ts,js}',
        '**/model/*.{ts,js}',
        '**/model/**/*.{ts,js}',
        'model/*.{ts,js}',
        'model/**/*.{ts,js}',
      ],
      { cwd: this.cwd },
    );
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      this.modelsPaths.set(element, true);
    }
  }

  writeFileSync = () => {
    const paths: string[] = [];
    this.modelsPaths.forEach((value, key) => {
      if (value) {
        const newPath = key.replace(/\.(ts|js)$/, '');
        paths.push(`import "@/${newPath}";`);
      }
    });
    this.isTs = FS.existsSync(path.join(process.cwd(), 'tsconfig.json'));
    const out = path.join(process.cwd(), 'src', '.models' + (this.isTs ? '.ts' : '.js'));
    FS.writeFileSync(out, paths.join('\n'), { flag: 'w+', encoding: 'utf-8' });
  };

  watch = () => {
    chokidar
      .watch(`${this.cwd}`, {
        cwd: this.cwd,
        ignored: (childPath) => {
          if (/node_modules/.test(childPath)) {
            return true;
          }
          if (/(?:^|\/)(models?)(?:\/[^\/]*)*\/([^\/]*?)\.(ts|js)$/.test(childPath)) {
            return false;
          }
          const stats = FS.statSync(childPath);
          if (stats.isDirectory()) {
            return false;
          }
          return true;
        },
      })
      // @ts-ignore
      .on('all', (event: any, pathName: string) => {
        if (event === 'add') {
          if (!this.modelsPaths.get(pathName)) {
            this.modelsPaths.set(pathName, true);
            this.writeFileSync();
          }
        } else if (event === 'unlink') {
          if (this.modelsPaths.get(pathName)) {
            this.modelsPaths.set(pathName, false);
            this.writeFileSync();
          }
        }
      });
  };

  /***/
  build = () => {
    this.writeFileSync();
  };
}

/**
 * 编译过程扩展
 */
export default (ctx: IPluginContext) => {
  const instance = new ModelInstance();
  ctx.onBuildStart(() => {
    /**生成文件*/
    instance.build();
  });

  ctx.onBuildFinish(() => {
    if (process.env.NODE_ENV === 'development') {
      // 本地开发构建配置
      instance.watch();
    }
  });
};
