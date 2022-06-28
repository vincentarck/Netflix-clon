import Head from "next/head";
import Header from "../components/Header";
import {requests} from "../utils/request";
import { Movie } from "../typings";
import Banner from "../components/Banner";
import Row from "../components/Row";
import {modalState} from "../atoms/stateAtom";
import { useRecoilValue } from "recoil";
import Modal from "../components/Modal";
import useAuth from "../hooks/useAuth";
import Router from "next/router";
import {useRouter} from "next/router"
interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  allGenre:Movie[]
}
const Home = ({
  netflixOriginals,
  trendingNow,
  topRated,
  actionMovies,
  comedyMovies,
  horrorMovies,
  documentaries,
  romanceMovies,
  allGenre
}: Props) => {
  const showModal = useRecoilValue(modalState);
  const {user, loading} = useAuth();
  return (
    <div className="relative h-screen max-w-screen bg-gradient-to-b lg:h-[140vh]">
      <Head>
        <title>Create Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="pl-3 pb-24 lg:pl-6">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-20 md:mt-11">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>

      {showModal && <Modal />}
    </div>
  );
};

export const getServerSideProps = async () => {

  const [
    netflixOriginals,
    actionMovies,
    comedyMovies,
    documentaries,
    horrorMovies,
    romanceMovies,
    topRated,
    trendingNow,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
  ]);
  const fetchAll = await fetch(requests.fetchAllGenres).then((res) => res.json())
  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      allGenre:fetchAll
    },
  };
};
export default Home;
