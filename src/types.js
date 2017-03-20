// @flow

export type Data = {
  scriptures: {[scriptureId: string]: Scripture},
  tags: {[tagId: string]: Tag}
  // name?
}

export type Game = {
  type: 'absorb' | 'memorize' | 'recall',
}

export type Tag = {
  id: string,
  name: string,
  color: string,
}

export type Scripture = {
  id: string,
  tags: [string],
  nickname: string,
  reference: string,
  text: string,
  keywords: ?Array<number>, // indices
  chunks: ?Array<string>,
  options: {
    [gameId: string]: any,
  },
  scores: {
    // TODO maybe recycle scores that are over a month old or something, that aren't the all-time best
    [gameId: string]: Array<{
      date: number,
      // any other info that you want to store
    }>
  }
}
