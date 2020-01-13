export interface SiriusDeeplink {
  ModuleListResponse: ModuleListResponse;
}

export interface ModuleListResponse {
  messages: Message[];
  status: number;
  moduleList: ModuleList;
}

export interface Message {
  code: number;
  message: string;
}

export interface ModuleList {
  modules: Module[];
}

export interface Module {
  moduleResponse: ModuleResponse;
  moduleArea: string;
  moduleType: string;
  updateFrequency: number;
  wallClockRenderTime: string;
}

export interface ModuleResponse {
  moduleDetails: ModuleDetails;
}

export interface ModuleDetails {
  liveChannelResponse: ModuleDetailsLiveChannelResponse;
}

export interface ModuleDetailsLiveChannelResponse {
  liveChannelResponses: LiveChannelResponseElement[];
}

export interface LiveChannelResponseElement {
  channelId: string;
  channel: DeepLinkChannel;
  aodEpisodeCount: number;
  markerLists: MarkerList[];
}

export interface DeepLinkChannel {
  channelGuid: string;
  channelId: string;
  name: string;
  shortName: string;
  marketingName: string;
  streamingName: string;
  sortOrder: number;
  mediumDescription: string;
  longDescription: string;
  url: string;
  clientBufferDuration: number;
  isMature: string;
  isMySxm: boolean;
  spanishContent: boolean;
  isBizMature: string;
  siriusChannelNumber: string;
  siriusServiceId: string;
  xmChannelNumber: string;
  xmServiceId: string;
  geoRestrictions: string;
  connectInfo: ConnectInfo;
  disableRecommendations: boolean;
  isPlayByPlay: boolean;
  deepLinkId: string;
  satOnly: boolean;
  phonetics: Phonetic[];
  phoneticsVersion: number;
  liveDelay: number;
  disableAllBanners: boolean;
  curatedBanners: any;
  freeToAir: boolean;
  channelContentType: string;
  tuneMethod: string;
  parentChannelIds: string;
  sequencerTuneChannelId: string;
  liveVideoEligible: boolean;
  darkBackgroundColor: string;
  lightBackgroundColor: string;
  permanentName: string;
  excludePandoraButton: boolean;
  shortDescription: string;
  inactivityTimeouts: InactivityTimeout[];
  inactivityTimeout: number;
  isAvailable: boolean;
  isFavorite: boolean;
  isPersonalized: boolean;
  channelNumber: string;
  images: Images;
  categories: Categories;
  aodShowCount: number;
  subscribed: boolean;
  ipOnly: boolean;
}

export interface Categories {
  categories: Category[];
}

export interface Category {
  categoryGuid: string;
  name: string;
  sortOrder: number;
  key: string;
  order: number;
  isPrimary: string;
  shortName: string;
  images: any;
  channels: any;
}

export interface ConnectInfo {
  phone: string;
  email: string;
  twitter: string;
  twitterLink: string;
  facebook: string;
  facebookLink: string;
}

export interface Images {
  images: Image[];
}

export interface Image {
  name: string;
  url: string;
  relativeUrl: string;
  height: number;
  width: number;
  platform?: string;
}

export interface InactivityTimeout {
  platform: string;
  locale: string;
  value: number;
}

export interface Phonetic {
  pronunciation: string;
  language: string;
}

export interface MarkerList {
  layer: string;
  markers: Marker[];
}

export interface Marker {
  assetGUID: string;
  consumptionInfo?: string;
  layer: string;
  time: number;
  timestamp: Timestamp;
  containerGUID: string;
  cut?: Cut;
  duration?: number;
  episode?: Episode;
}

export interface Cut {
  legacyIds: LegacyIDS;
  title: string;
  artists: Artist[];
  album?: Album;
  clipGUID?: string;
  galaxyAssetId: string;
  cutContentType: string;
  mref: string;
}

export interface Album {
  title: string;
  creativeArts: any[];
}

export interface Artist {
  name: string;
}

export interface LegacyIDS {
  siriusXMId: string;
  pid?: string;
}

export interface Episode {
  isLiveVideoEligible: boolean;
  show: Show;
}

export interface Show {
  longTitle: string;
  isLiveVideoEligible: boolean;
  guid: string;
  showGUID: string;
  vodEpisodeCountFamilyFriendly: number;
  newVodEpisodeCountFamilyFriendly: number;
  aodEpisodeCount: number;
  programType: string;
  vodEpisodeCount: number;
  isPlaceholderShow: boolean;
}

export interface Timestamp {
  absolute: string;
}
