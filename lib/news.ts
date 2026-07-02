export type HomeNewsItem = {
  enabled: boolean;
  text: string;
  href?: string;
};

// HOMEに1行だけ出す新着ニュースです。
// 一般ユーザーに見せたい機能追加や重要なお知らせがある時だけ enabled を true にしてください。
// アップデート履歴そのものは管理者だけ表示します。
export const HOME_NEWS: HomeNewsItem = {
  enabled: false,
  text: "",
  href: "",
};
