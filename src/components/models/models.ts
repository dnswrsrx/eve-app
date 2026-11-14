import { Timestamp } from "firebase/firestore";

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
  Pages = 'pages',
  Contact = 'contact-page',
  Products = 'products',
  Users = 'users',
  AccessCodes = 'access-codes',
}

/* Types and Interfaces */

export interface Category {
  id: string,
  name: string,
  createdAt: Timestamp
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
  createdAt: Timestamp,
  number: number,
}

export interface Group {
  id?: string,
  words: WordList,
  free?: boolean,
  createdAt: Timestamp,
  number: number,
}

export interface HomeLanguage {
  id?: string,
  name: string,
  bannerHeading: string,
  bannerText: string,
  mainContent: string,
  createdAt: Timestamp,
}

export interface StudyGuideSection {
  id: string,
  name: string,
  picture: string,
}

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
  id: string,
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
