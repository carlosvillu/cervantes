import {z} from 'zod'

import {Chapter} from './Chapter.js'

const ChaptersValidations = z.object({chapters: z.instanceof(Chapter, {message: 'Chapters required'}).array()})

export class Chapters {
  static create({chapters}: z.infer<typeof ChaptersValidations>) {
    ChaptersValidations.parse({chapters})
    return new Chapters(chapters, false)
  }

  static empty() {
    return new Chapters(undefined, true)
  }

  constructor(public readonly chapters: Chapter[] = [], public readonly empty?: boolean) {}

  titles(): string[] {
    return this.chapters.filter(chapter => !chapter.isEmpty()).map(chapter => chapter.title!)
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  toJSON() {
    return {
      chapters: this.chapters.map(chapter => chapter.toJSON())
    }
  }
}
