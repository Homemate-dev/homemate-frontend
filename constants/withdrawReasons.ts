// constants/withdrawReasons.ts

export type WithdrawLink = {
  label: string
  url: string
}

export type WithdrawReasonContext = {
  isIosSafari: boolean
}

export type WithdrawReasonKey =
  | 'NOTI_ISSUE'
  | 'HARD_TO_USE'
  | 'LACK_REWARD'
  | 'HARD_ROUTINE'
  | 'MISSING_FEATURE'
  | 'REJOIN_PLAN'
  | 'WRITE_SELF'

export type WithdrawBlock =
  | {
      type: 'text'
      value: (userName: string, ctx: WithdrawReasonContext) => string
      visibleIf?: (ctx: WithdrawReasonContext) => boolean
    }
  | {
      type: 'chips'
      items: (ctx: WithdrawReasonContext) => WithdrawLink[]
      visibleIf?: (ctx: WithdrawReasonContext) => boolean
    }

export type WithdrawReasonConfig = {
  key: WithdrawReasonKey
  /** 드롭다운 라벨 */
  title: string
  /** 선택 후 화면에 보여줄 블록들 (텍스트/칩 묶음) */
  blocks: WithdrawBlock[]
  /** 텍스트 입력 필요 여부 */
  input?: {
    enabled: boolean
    required: boolean
    placeholder: string
  }
}

export const WITHDRAW_REASONS: WithdrawReasonConfig[] = [
  {
    key: 'NOTI_ISSUE',
    title: '알림이 제대로 오지 않아요',
    blocks: [
      // 1) 공통 안내문
      {
        type: 'text',
        value: () =>
          `마이페이지의 알림 시간은 변경 이후 집안일을 등록할 때 적용돼요.\n이전에 등록한 집안일의 알림은 수정되지 않아요.`,
      },

      // 2) 공통 칩(1개) - 위쪽에 위치
      {
        type: 'chips',
        items: () => [
          {
            label: '⏰ 마이페이지의 알림 시간 설정',
            url: 'https://www.notion.so/2ddaba73bec6800dbed0e0762be9c93f?pvs=21',
          },
        ],
      },

      // 3) iOS Safari 전용 안내문 (아래쪽에 추가로 노출)
      {
        type: 'text',
        visibleIf: (ctx) => ctx.isIosSafari,
        value: () =>
          `iOS의 Safari를 사용 중이시군요!\n알림이 발송되지 않을 때의 원인은 아래와 같아요.`,
      },

      // 4) iOS Safari 전용 칩(2개) - 아래쪽에 위치
      {
        type: 'chips',
        visibleIf: (ctx) => ctx.isIosSafari,
        items: () => [
          {
            label: '🔔 Safari 알림 허용하기',
            url: 'https://www.notion.so/29aaba73bec681948470fed9040bf094?pvs=21',
          },
          {
            label: '📱 홈 화면에 추가하기',
            url: 'https://www.notion.so/29aaba73bec681e4b41eefaf33c554d9?pvs=21',
          },
        ],
      },
    ],
  },

  {
    key: 'HARD_TO_USE',
    title: '서비스 사용이 어려워요',
    blocks: [
      {
        type: 'text',
        value: (userName) =>
          `${userName}님이 더 쉽게 사용할 수 있도록 홈메이트 사용법을 준비했어요.`,
      },
      {
        type: 'chips',
        items: () => [
          {
            label: '📕 홈메이트 사용법 바로가기',
            url: 'https://www.notion.so/2ddaba73bec6804bbdabe5f0e4105d11?pvs=21',
          },
        ],
      },
    ],
  },

  {
    key: 'LACK_REWARD',
    title: '보상이 부족해요',
    blocks: [
      {
        type: 'text',
        value: (userName) =>
          `홈메이트는 반복되는 집안일을 재밌고, 보상을 느낄 수 있도록 앞으로도 더 다양한 보상과 혜택을 마련할 예정입니다.\n${userName}님이 홈메이트와 함께하며 성장한 기록들을 되돌아 보는 것은 어떠신가요?`,
      },
      {
        type: 'chips',
        items: () => [
          {
            label: '🎖 획득한 뱃지를 보는 방법',
            url: 'https://www.notion.so/29aaba73bec68161a70bc6168567ab8d?pvs=21',
          },
        ],
      },
    ],
  },

  {
    key: 'HARD_ROUTINE',
    title: '루틴 관리가 어려워요',
    blocks: [
      {
        type: 'text',
        value: (userName) => `${userName}님이 집안일 루틴을 관리할 수 있는 꿀팁을 알려드려요!`,
      },
      {
        type: 'chips',
        items: () => [
          {
            label: '🔁 집안일 루틴 확인하는 방법',
            url: 'https://www.notion.so/29aaba73bec6815ea7f8cab92ae69549?pvs=21',
          },
        ],
      },
    ],
  },

  {
    key: 'MISSING_FEATURE',
    title: '필요한 기능이 없어요',
    blocks: [
      {
        type: 'text',
        value: () =>
          `어떤 기능이 필요하셨나요? 부족하거나 아쉬웠던 부분을\n알려 주시면 더 좋은 서비스로 발전해 있을게요!`,
      },
    ],
    input: {
      enabled: true,
      required: false,
      placeholder: '자유롭게 작성해주세요 (선택)',
    },
  },

  {
    key: 'REJOIN_PLAN',
    title: '재가입 할 예정이에요',
    blocks: [
      {
        type: 'text',
        value: () =>
          `재가입 하시려는 이유가 무엇인가요?\n이유를 알려주시면 더 나은 서비스를 만드는데 큰 도움이 되어요!`,
      },
    ],
    input: {
      enabled: true,
      required: false,
      placeholder: '자유롭게 작성해주세요 (선택)',
    },
  },

  {
    key: 'WRITE_SELF',
    title: '직접 작성할게요',
    blocks: [
      {
        type: 'text',
        value: (userName) =>
          `${userName}님의 소중한 의견을 반영하여 더 나은 서비스를 만들어가도록 노력할게요.`,
      },
    ],
    input: {
      enabled: true,
      required: true,
      placeholder: ' 500자 이내로 자유롭게 작성해주세요 (필수)',
    },
  },
]
