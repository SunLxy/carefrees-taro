import { Button, View } from '@tarojs/components';
import { useValtioState } from '@carefrees/taro-utils/esm/valtio';
import { useId } from '@carefrees/taro-utils';
import Taro from '@tarojs/taro';
import { Fragment, useEffect, useRef, useState } from 'react';

const Item = (props) => {
  const { parentId, index } = props;
  const [visible, setVisible] = useState(true);
  const refHeight = useRef(undefined);
  const id = useId('main-item' + index);

  const calc = () => {
    const query = Taro.createSelectorQuery();
    query.select(`#${id}`).boundingClientRect();
    query.exec(function (res) {
      if (Array.isArray(res)) {
        const [first] = res;
        refHeight.current = first.height;
        // if (first.height !== instance.store.height)
      }
    });
  };

  useEffect(() => {
    calc();
  }, []);

  const Observer = () => {
    Taro.createIntersectionObserver({})
      .relativeTo(`#${parentId}`, { bottom: 50, top: 50 })
      .observe(`#${id}`, (res) => {
        console.log(`index==${index}=>`, res);
        if (res.intersectionRect?.top === 0) {
          // 这个是离开
          setVisible(false);
        } else {
          // 进入
          setVisible(true);
        }
      });
    return () => {};
  };

  useEffect(() => {
    const unMount = Observer();
    return () => unMount?.();
  }, []);

  return (
    <View style={refHeight.current ? { height: refHeight.current } : {}} id={id}>
      {visible ? (
        <View>
          子项内容,{Array.from({ length: index }).map((it) => '子项内容')}---{index}
        </View>
      ) : (
        <Fragment />
      )}
    </View>
  );
};

const MainTable = () => {
  // const [state, , instance] = useProxy("customer_management");
  // const dataList = state.dataList || []
  const [state, dispatch] = useValtioState({ list: Array.from({ length: 10 }).map((_, index) => ({ index })) });
  const luits = state.list;
  const id = useId('main');

  return (
    <View>
      <Button
        onClick={() => {
          const length = luits.length;
          dispatch({ list: luits.concat(Array.from({ length: 10 }).map((_, index) => ({ index: length + index }))) });
        }}
      >
        按钮
      </Button>

      <View style={{ overflow: 'auto', height: 300 }} id={id}>
        {luits.map((it, index) => {
          return <Item index={index} key={it.index} parentId={id} />;
        })}
      </View>
    </View>
  );
};

export default MainTable;
