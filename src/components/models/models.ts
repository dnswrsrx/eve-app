/* Enums */
export enum CategoryTypes {
  Top = 'Category',
  Sub = 'Subcategory',
  Lang = 'Language',
  Page = 'Page',
}

export enum PageTypes {
  Language = 'Language',
  Contact = 'Contact',
  Page = 'Private Pages',
}

export enum CollectionNames {
  Categories = 'top-level-categories',
  Subcategories = 'subcategories',
  Groups = 'groups',
  Tests = 'tests',
  Exercises = 'exercises',
  HomeLanguages = 'home-languages',
  StudyGuides = 'weekly-study-guides',
  Pages = 'pages',
  Contact = 'contact-page',
  Products = 'products',
  Users = 'users',
  AccessCodes = 'access-codes',
}

export enum DefaultStudyGuide {
  GeneralVocab = '<table class="se-table-layout-auto"><tbody><tr><th><div><br></div></th><th><div>Exercises</div></th></tr><tr><td><div><strong>englishvocabularyexercises.com</strong></div></td><td><div><br></div><br></td></tr><tr><td><div><strong>Picture Dictionary</strong></div></td><td><div><br></div></td></tr><tr><td><div><strong>Phrasal Verbs</strong></div></td><td><div><div><br></div><br></div></td></tr><tr><td><div><strong>Idioms</strong>​</div></td><td><div><br></div></td></tr></tbody></table><p><br></p>',
  AcademicVocab = '<table><tbody><tr><th><div><br></div></th><th><div>Exercises</div></th></tr><tr><td><div><strong>englishvocabularyexercises.com</strong></div></td><td><div><br></div><br></td></tr></tbody></table><p><br></p><p><br></p>',
  Reading = '<table><tbody><tr><th><div>Difficulty</div></th><th><div>Exercises</div></th></tr><tr><td><div><strong>Less Difficult</strong></div></td><td><div><br></div><br></td></tr><tr><td><div><strong>More Difficult</strong></div></td><td><p><br></p><br></td></tr></tbody></table><p><br></p>',
  Listening = '<table><tbody><tr><th><div>Level</div></th><th><div>Topic</div></th></tr><tr><td><div><strong>High Beginner</strong></div></td><td><div><br></div></td></tr><tr><td><div><strong>Intermediate</strong></div></td><td><div><br></div></td></tr><tr><td><div><strong>Low Advanced</strong></div></td><td><div><br></div></td></tr></tbody></table><p><br></p>',
  Pronunciation = '<table><tbody><tr><th><div>Subject</div></th><th><div>Exercises</div></th></tr><tr><td><div><strong>General Sounds Contrast</strong></div></td><td><div><br></div></td></tr><tr><td><div>​<strong>Sounds of English</strong>​</div></td><td><div><br></div></td></tr><tr><td><div><div><strong>Syllable Stress</strong><br></div></div></td><td><div><br></div></td></tr></tbody></table><p><br></p>',
  Grammar = '<table><tbody><tr><th><div>Exercises</div></th></tr><tr><td><div><br></div></td></tr></tbody></table><p><br></p>',
  Speaking = '<table><tbody><tr><th><div>Activity</div></th><th><div>Topic</div></th></tr><tr><td><div><strong>Important phrases to learn</strong></div></td><td><div><strong></strong><br></div><br></td></tr><tr><td><div><strong>Personal discussion topic to talk about</strong></div></td><td><div><div><br></div></div></td></tr><tr><td><div><strong>Opinion Topic to Talk About</strong></div></td><td><p><br></p></td></tr></tbody></table><p><br></p>',
  TestPrep = '<table><tbody><tr><th><div>Test</div></th><th><div>Exercises</div></th></tr><tr><td><div><strong>TOEFL</strong></div></td><td><div><br></div></td></tr><tr><td><div><strong>TOEIC</strong></div></td><td><div><br></div></td></tr><tr><td><div><strong>IELTS</strong></div></td><td><div><div><br></div></div></td></tr></tbody></table><p><br></p>',
}

/* Types and Interfaces */

export interface ParamsProps {
  categoryId: string,
  subcategoryId: string,
  groupId: string,
  exerciseId: string,
  pageId: string,
  guideId: string,
  type: PageTypes,
  slug: string,
}

export interface MatchProps {
  isExact: boolean,
  params: ParamsProps,
  path: string,
  url: string,
}

export interface Category {
  id: string,
  name: string,
  createdAt: firebase.firestore.Timestamp,
  parent?: string,
  numberOfFreeGroups?: number,
}

export interface CategoryDocument {
  name: string,
  createdAt: Date,
  parent?: string,
  bannerHeading?: string,
  bannerText?: string,
  mainContent?: string,
  slug?: string,
}

export type CategoryClickFunction = (id: string) => void;
export type ShouldFlipFunction = (id: string) => (prevDecisionData: string, currentDecisionData: string) => boolean;

export interface CategoryCardProps {
  type: CategoryTypes | PageTypes,
  categoryId: string,
  category: Category,
  categoryClicked: CategoryClickFunction,
  shouldFlip: ShouldFlipFunction,
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>,
  uniqueIdentifiers?: string[],
}

export interface Word {
  customDefinition: string,
  dictionaryUrl: string,
  apiDefinitions?: any,
}

export interface WordList {
  [word: string]: Word,
}

export interface Question {
  answer: string,
  question: string | undefined
}

export type QuestionList = Question[]

export interface Exercise {
  id?: string,
  questions: QuestionList,
  createdAt: firebase.firestore.Timestamp,
  number: number,
}

export interface Group {
  id?: string,
  words: WordList,
  free?: boolean,
  createdAt: firebase.firestore.Timestamp,
  number: number,
}

export interface HomeLanguage {
  id?: string,
  name: string,
  bannerHeading: string,
  bannerText: string,
  mainContent: string,
  createdAt: firebase.firestore.Timestamp,
}

export interface StudyGuide {
  id?: string,
  startDate: firebase.firestore.Timestamp,
  endDate: firebase.firestore.Timestamp,
  generalVocabContent: string,
  academicVocabContent: string,
  readingContent: string,
  listeningContent: string,
  pronunciationContent: string,
  grammarContent: string,
  speakingContent: string,
  testPrepContent: string,
  createdAt: firebase.firestore.Timestamp,
}

export interface StudyGuideDocument {
  startDate: firebase.firestore.Timestamp,
  endDate: firebase.firestore.Timestamp,
  generalVocabContent: string,
  academicVocabContent: string,
  readingContent: string,
  listeningContent: string,
  pronunciationContent: string,
  grammarContent: string,
  speakingContent: string,
  testPrepContent: string,
  createdAt?: Date,
}

export interface StudyGuideSection {
  id: string,
  name: string,
  picture: string,
}

export interface SelectedMonth {
  year: number,
  month: number,
}

export interface FilterDates {
  startDate: Date,
  endDate: Date,
}

export type FilterFunction = (selectedMonth: FilterDates) => void;

export interface Phonetic {
  text: string,
  audio?: string,
}

export interface ApiDefinition {
  definition: string,
  synonyms: string[],
  antonyms: string[],
  example?: string,
}

export interface Meaning {
  partOfSpeech: string,
  definitions: ApiDefinition[],
  synonyms?: string[],
  antonyms?: string[],
}

export interface ApiWord {
  word: string,
  phonetics: Phonetic[],
  meanings: Meaning[],
}

export interface Definition {
  type: string,
  definition: string,
  example?: string | null,
  synonyms?: string[] | null,
  selected: boolean,
}

export interface Definitions {
  word: string,
  phonetics: Phonetic[],
  definitions: Definition[],
}

export interface Product {
  id: string,
  description: string,
  name: string,
  stripe_metadata_price: number,
  stripe_metadata_price_id: string,
}

export interface Price {
  active: boolean,
  billing_scheme: string,
  currency: string,
  unit_amount?: number,
}

export interface UserInfo {
  isAdmin?: boolean,
  email: string,
  main?: string,
  accessCode?: string,
  accessCodeExpiry?: Date;
  stripeId: string,
  stripeLink: string,
}

export interface SubscriptionItem {
  price: {
    product: {
      name: string
    }
  }
}

export interface CurrentSubscription {
  status: string,
  quantity: number,
  items: SubscriptionItem[],
  created: { seconds: number },
  cancel_at: { seconds: number } | null,
  cancel_at_period_end: boolean,
  current_period_end: { seconds: number },
}

export interface AccessCodeInfo {
  quantity: number;
  remaining?: number;
  current_period_end: {seconds: number},
  ended_at: {seconds: number} | null,
  status: string,
}

export interface Subscriber {
  email: string,
  created: {seconds: number},
}

export interface Subscribers {
  [uid: string]: Subscriber
}
