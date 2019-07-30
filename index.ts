import * as path from 'path'
import { fetchTweets } from './lib/fetch-tweets'
import { count } from './lib/count'


const main = async () => {
  // const tweets = await fetchTweets()

  const songsYamlPath = path.resolve(path.join(__dirname, 'lib', 'songs.yml'))
  const tweetsJsonPath = path.resolve(path.join(__dirname, 'output', 'tweets_2019-7-31_3-57.json'))
  const counter = count(songsYamlPath, tweetsJsonPath)
  console.log(counter)
}

main()
