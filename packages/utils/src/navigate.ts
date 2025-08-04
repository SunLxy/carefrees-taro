import Taro from '@tarojs/taro';

class NavigateInstance {
  /** 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   * @supported weapp, h5, rn, tt, harmony, harmony_hybrid
   * @example
   * ```json
   * {
   *   "tabBar": {
   *     "list": [{
   *       "pagePath": "index",
   *       "text": "首页"
   *     },{
   *       "pagePath": "other",
   *       "text": "其他"
   *     }]
   *   }
   * }
   * ```
   *
   * ```tsx
   * Taro.switchTab({
   *   url: '/index'
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html
   */
  switchTab = (options: Taro.switchTab.Option) => {
    return Taro.switchTab(options);
  };
  /** 关闭所有页面，打开到应用内的某个页面
   * @supported weapp, h5, rn, tt, harmony, harmony_hybrid
   * @example
   * ```tsx
   * Taro.reLaunch({
   *   url: 'test?id=1'
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html
   */
  reLaunch = (options: Taro.reLaunch.Option) => {
    return Taro.reLaunch(options);
  };

  /** 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
   * @supported weapp, h5, rn, tt, harmony, harmony_hybrid
   * @h5 未针对 tabbar 页面做限制处理
   * @example
   * ```tsx
   * Taro.redirectTo({
   *   url: 'test?id=1'
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html
   */
  redirectTo = (options: Taro.redirectTo.Option) => {
    return Taro.redirectTo(options);
  };

  /** 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 Taro.navigateBack 可以返回到原页面。小程序中页面栈最多十层。
   * @supported weapp, h5, rn, tt, harmony, harmony_hybrid
   * @h5 未针对 tabbar 页面做限制处理
   * @example
   * ```tsx
   * Taro.navigateTo({
   *   url: 'test?id=1',
   *   events: {
   *     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
   *     acceptDataFromOpenedPage: function(data) {
   *       console.log(data)
   *     },
   *     someEvent: function(data) {
   *       console.log(data)
   *     }
   *     ...
   *   },
   *   success: function (res) {
   *     // 通过eventChannel向被打开页面传送数据
   *     res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
   */
  navigateTo = (options: Taro.navigateTo.Option) => {
    return Taro.navigateTo(options);
  };

  /** 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
   * @supported weapp, h5, rn, tt, harmony, harmony_hybrid
   * @h5 若入参 delta 大于现有页面数时，返回应用打开的第一个页面（如果想要返回首页请使用 reLaunch 方法）。
   * @example
   * ```tsx
   * // 注意：调用 navigateTo 跳转时，调用该方法的页面会被加入堆栈，而 redirectTo 方法则不会。见下方示例代码
   * // 此处是A页面
   * Taro.navigateTo({
   *   url: 'B?id=1'
   * })
   * // 此处是B页面
   * Taro.navigateTo({
   *   url: 'C?id=1'
   * })
   * // 在C页面内 navigateBack，将返回A页面
   * Taro.navigateBack({
   *   delta: 2
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html
   */
  navigateBack = (options: Taro.navigateBack.Option) => {
    return Taro.navigateBack(options);
  };
}

/**路由跳转*/
export const navigate = new NavigateInstance();
export default navigate;
