import type { AppLanguage } from '../../context/LanguageContext';
import type { FeedbackAppCopy, FeedbackChannel, FeedbackStatus, RatingFilter } from './types';

export const feedbackAppCopy: FeedbackAppCopy = {
  en: {
    addFeedback: 'Add Feedback',
    captureDescription: 'Add a new response and route it into the review queue.',
    captureTitle: 'Capture Feedback',
    channel: 'Channel',
    comment: 'Comment',
    csvHeaders: ['User', 'Rating', 'Status', 'Channel', 'Date', 'Comment', 'Response'],
    customer: 'Customer',
    customerPlaceholder: 'Customer name',
    delete: 'Delete',
    draftResponse: 'Draft Response',
    exportCsv: 'Export CSV',
    exportJson: 'Export JSON',
    feedbackAdded: (user: string) => `${user}'s feedback was added and marked for review.`,
    inboxDescription: 'Filter, review, and resolve incoming feedback.',
    inboxTitle: 'Feedback Inbox',
    invalidDraft: 'Add a user and comment before saving feedback.',
    markReviewed: 'Mark Reviewed',
    metrics: {
      averageRating: 'Avg Rating',
      newThisSession: 'New This Session',
      openItems: 'Open Items',
      reviewed: 'Reviewed',
      totalFeedback: 'Total Feedback',
    },
    noFeedback: 'No feedback matches this view.',
    noResponse: 'Write a response before resolving feedback.',
    noSelection: 'Select feedback before sending a response.',
    pageDescription: 'Collect, manage, and analyze customer feedback with ease',
    pageHighlight: 'Feedback',
    pageTitle: 'App',
    rating: 'Rating',
    ratingAria: (rating: number) => `${rating} star rating`,
    ready: 'Ready to collect the next feedback item.',
    removed: (user: string) => `${user}'s feedback was removed.`,
    removedFallback: 'Feedback removed.',
    reset: 'Reset',
    resetDone: 'Feedback workspace reset to the starter data.',
    resolved: (user: string) => `${user}'s feedback was resolved with a response.`,
    response: 'Response',
    responseDraftPlaceholder: 'Write a response',
    responsePrefix: 'Response:',
    responseTemplates: [
      'Thanks for the thoughtful feedback. We reviewed it with the team and will fold it into the next pass.',
      'Thanks for reporting this. We marked it for follow-up and will keep the handoff notes updated.',
      'Glad to hear this worked well. We appreciate the time you took to share the detail.',
    ],
    restored: 'Feedback workspace restored from local storage.',
    reviewed: 'Feedback marked as reviewed.',
    searchPlaceholder: 'Search feedback',
    sendAndResolve: 'Send and Resolve',
    status: {
      new: 'new',
      resolved: 'resolved',
      reviewed: 'reviewed',
    },
    summaryPlaceholder: 'Write the feedback summary',
    templates: 'Templates',
    workspaceReady: 'Feedback workspace is ready to download.',
  },
  ko: {
    addFeedback: '피드백 추가',
    captureDescription: '새 응답을 추가하고 검토 대기열로 보냅니다.',
    captureTitle: '피드백 수집',
    channel: '채널',
    comment: '의견',
    csvHeaders: ['고객', '평점', '상태', '채널', '날짜', '의견', '응답'],
    customer: '고객',
    customerPlaceholder: '고객 이름',
    delete: '삭제',
    draftResponse: '응답 작성',
    exportCsv: 'CSV 내보내기',
    exportJson: 'JSON 내보내기',
    feedbackAdded: (user: string) => `${user}님의 피드백을 추가하고 검토 대상으로 표시했습니다.`,
    inboxDescription: '들어온 피드백을 필터링하고 검토한 뒤 해결 상태로 정리합니다.',
    inboxTitle: '피드백 받은함',
    invalidDraft: '피드백을 저장하려면 고객 이름과 의견을 입력하세요.',
    markReviewed: '검토 완료',
    metrics: {
      averageRating: '평균 평점',
      newThisSession: '이번 세션 신규',
      openItems: '미해결 항목',
      reviewed: '검토됨',
      totalFeedback: '전체 피드백',
    },
    noFeedback: '이 보기에 맞는 피드백이 없습니다.',
    noResponse: '피드백을 해결하려면 응답을 먼저 작성하세요.',
    noSelection: '응답을 보내려면 피드백을 먼저 선택하세요.',
    pageDescription: '고객 피드백을 수집하고, 관리하고, 분석하는 작업 공간입니다.',
    pageHighlight: '피드백',
    pageTitle: '앱',
    rating: '평점',
    ratingAria: (rating: number) => `${rating}점 평점`,
    ready: '다음 피드백을 수집할 준비가 되었습니다.',
    removed: (user: string) => `${user}님의 피드백을 삭제했습니다.`,
    removedFallback: '피드백을 삭제했습니다.',
    reset: '초기화',
    resetDone: '피드백 작업 공간을 시작 데이터로 초기화했습니다.',
    resolved: (user: string) => `${user}님의 피드백에 응답하고 해결 처리했습니다.`,
    response: '응답',
    responseDraftPlaceholder: '응답 작성',
    responsePrefix: '응답:',
    responseTemplates: [
      '소중한 피드백 감사합니다. 팀과 함께 검토했고 다음 개선 작업에 반영하겠습니다.',
      '알려주셔서 감사합니다. 후속 확인 항목으로 표시하고 전달 메모를 계속 업데이트하겠습니다.',
      '잘 작동했다니 기쁩니다. 자세한 내용을 공유해주셔서 감사합니다.',
    ],
    restored: '로컬 저장소에서 피드백 작업 공간을 복원했습니다.',
    reviewed: '피드백을 검토 완료로 표시했습니다.',
    searchPlaceholder: '피드백 검색',
    sendAndResolve: '보내고 해결',
    status: {
      new: '신규',
      resolved: '해결됨',
      reviewed: '검토됨',
    },
    summaryPlaceholder: '피드백 요약 작성',
    templates: '템플릿',
    workspaceReady: '피드백 작업 공간을 다운로드할 수 있습니다.',
  },
};

export const feedbackFilterLabels: Record<AppLanguage, Record<RatingFilter, string>> = {
  en: {
    all: 'All',
    high: '4+ stars',
    'needs-review': 'Needs review',
    resolved: 'Resolved',
  },
  ko: {
    all: '전체',
    high: '4점 이상',
    'needs-review': '검토 필요',
    resolved: '해결됨',
  },
};

export const feedbackChannelLabels: Record<AppLanguage, Record<FeedbackChannel, string>> = {
  en: {
    Email: 'Email',
    'In-app': 'In-app',
    Web: 'Web',
  },
  ko: {
    Email: '이메일',
    'In-app': '앱 내부',
    Web: '웹',
  },
};

const feedbackSampleDisplayCopy: Record<string, string> = {
  'Bob Johnson': '박보람',
  'Excellent service!': '서비스가 아주 좋았습니다!',
  'Fast response and clear handoff.': '응답이 빠르고 인수인계가 명확했습니다.',
  'Jane Smith': '이지은',
  'John Doe': '김민수',
  'New customer': '새 고객',
  'Outstanding!': '정말 만족스러웠습니다!',
  'Very good experience': '매우 좋은 경험이었습니다.',
};

export function getFeedbackStatusLabel(language: AppLanguage, status: FeedbackStatus) {
  return feedbackAppCopy[language].status[status];
}

export function getFeedbackChannelLabel(language: AppLanguage, channel: FeedbackChannel) {
  return feedbackChannelLabels[language][channel];
}

export function getFeedbackDisplayText(language: AppLanguage, value: string) {
  return language === 'ko' ? feedbackSampleDisplayCopy[value] ?? value : value;
}
