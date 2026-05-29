export {};

type KakaoLink = {
  mobileWebUrl?: string;
  webUrl?: string;
};

type KakaoShareDefaultTemplate = {
  objectType: 'feed';
  content: {
    title: string;
    description?: string;
    imageUrl?: string;
    link: KakaoLink;
  };
  buttons?: Array<{
    title: string;
    link: KakaoLink;
  }>;
};

declare global {
  interface Window {
    Kakao?: {
      init: (javascriptKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (template: KakaoShareDefaultTemplate) => void;
      };
    };
  }
}
