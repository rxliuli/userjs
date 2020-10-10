function addOtherStyle() {
    // language=CSS
    // noinspection CssUnusedSymbol
    GM_addStyle(`
  /*需要透明化的元素*/
  body,
  .p-client_container,
  .p-client,
  .p-client .p-top_nav,
  .p-workspace {
      background-color: transparent;
  }
  .p-workspace {
      /*background-image: url(https://cdn.jsdelivr.net/gh/rxliuli/img-bed/20200306083232.jpg);*/
      /*background-repeat: no-repeat;*/
      /*background-size: cover;*/
  }

  /* 工作区 */
  .p-workspace *,
  .p-workspace__channel_sidebar *,
  .p-workspace__primary_view *,
  .p-workspace__secondary_view *,
  .c-virtual_list__item * {
      background-color: rgba(48, 48, 48, 0.08) !important;
  }
  /* 鼠标在消息上 */
  .c-message_kit__message:hover {
      background-color: rgba(48, 48, 48, 0.5) !important;
  }
  /* 消除文本特殊加重 */
  .c-message_kit__blocks--rich_text * {
      background-color: transparent !important;
  }
  .c-message_list__day_divider__line {
      border-color: rgba(48, 48, 48, 0.5) !important;
  }
  .p-top_nav__search{
      background-color: rgba(48, 48, 48, 0.08) !important;
  }
  `);
}

export { addOtherStyle };
