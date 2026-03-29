"use client";

declare global {
  interface Window {
    Kakao: any;
  }
}

interface RoomShareProps {
  type: "room";
  roomUrl: string;
  gameLabel: string;
  locations: string[];
}

interface ResultShareProps {
  type: "result";
  roomUrl: string;
  nickname: string;
  result: string;
  gameLabel: string;
}

type Props = RoomShareProps | ResultShareProps;

export default function KakaoShareButton(props: Props) {
  const handleShare = () => {
    if (!window.Kakao) {
      alert("카카오 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }

    if (props.type === "room") {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `🧗 클라이밍 랜덤 게임에 초대합니다!`,
          description: `게임: ${props.gameLabel}\n후보 장소: ${props.locations.join(", ")}\n\n링크를 눌러 참여하세요!`,
          imageUrl: "https://randomgame-bice.vercel.app/og-image.png",
          link: {
            mobileWebUrl: props.roomUrl,
            webUrl: props.roomUrl,
          },
        },
        buttons: [
          {
            title: "게임 참여하기",
            link: {
              mobileWebUrl: props.roomUrl,
              webUrl: props.roomUrl,
            },
          },
        ],
      });
    } else {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `🏆 ${props.nickname}의 클라이밍 장소가 결정됐어요!`,
          description: `📍 ${props.result}\n게임: ${props.gameLabel}\n\n링크를 눌러 함께 참여하세요!`,
          imageUrl: "https://randomgame-bice.vercel.app/og-image.png",
          link: {
            mobileWebUrl: props.roomUrl,
            webUrl: props.roomUrl,
          },
        },
        buttons: [
          {
            title: "나도 게임하기",
            link: {
              mobileWebUrl: props.roomUrl,
              webUrl: props.roomUrl,
            },
          },
        ],
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition"
      style={{ backgroundColor: "#FEE500", color: "#000000" }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 1C4.582 1 1 3.79 1 7.22c0 2.19 1.456 4.116 3.65 5.218L3.8 15.5a.25.25 0 0 0 .38.27L8 13.4c.328.04.662.06 1 .06 4.418 0 8-2.79 8-6.22C17 3.79 13.418 1 9 1z"
          fill="#000000"
        />
      </svg>
      카카오톡 공유
    </button>
  );
}
