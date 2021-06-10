export interface IModel {
  title: string,
  description: string,
  rating: number,
  img: {
    src: string,
    alt: string,
  },
  categories: Array<string>,
  author: string,
  url: string,
}
