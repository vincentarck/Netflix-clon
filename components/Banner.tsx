import React, { useState, useEffect } from "react";
import { Movie, Element } from "../typings";
import Image from "next/image";
import { baseUrl } from "../constants/movie";
import { FaPlay } from "react-icons/fa";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { requests, API_KEY } from "../utils/request";
import ReactPlayer from "react-player";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState, movieState, readyPlayTrailer } from "../atoms/stateAtom";

interface Props {
  netflixOriginals: Movie[];
}
function Banner({ netflixOriginals }: Props) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [CurrentMovieTrailer, setCurrentMovieTrailer] = useState<string | null>(
    null
  );
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState);
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [availTrailer, setAvailTrailer] = useRecoilState(readyPlayTrailer);
  const readyPlay = useRecoilValue(readyPlayTrailer);
  const [fullDes, setFullDes] = useState(false);

  const playerRef = React.useRef<ReactPlayer>(null);
  const randomBanner =
    netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)];

  useEffect(() => {
    async function fetchAndSetBannerMovie() {
      const res = await fetch(
        `https://api.themoviedb.org/3/${
          randomBanner?.media_type === "tv" ? "tv" : "movie"
        }/${randomBanner?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ).then((res) => res.json());
      if (res?.videos) {
        const index = res.videos?.results.findIndex((video: Element) => {
          return video.type === "Trailer";
        });
        const setBannerMovie = () => {
          setTimeout(() => {
            setCurrentMovieTrailer(res.videos.results[index].key);
          }, 500);
        };
        setBannerMovie();
      }
    }
    fetchAndSetBannerMovie();

    setMovie(randomBanner);
  }, [netflixOriginals]);

  const bannerStyle: string = CurrentMovieTrailer ? "top-[-280px]" : "top-0";
  const isFullDescMovie = fullDes
    ? movie?.overview
    : movie?.overview.slice(0, 150);
  return (
    <div className="flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[80vh] lg:justify-end lg:pb-12 md:scroll">
      <div className={`absolute ${bannerStyle} left-0 -z-10 h-full w-full`}>
        {!CurrentMovieTrailer ? (
          <Image
            src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <>
            {!availTrailer && "Loading"}
            <ReactPlayer
              ref={playerRef}
              playing={true}
              url={`
        https://www.youtube.com/watch?v=${CurrentMovieTrailer}`}
              width="100%"
              height="100%"
              muted
              loop
              onReady={() => {
                playerRef.current?.seekTo(25, "seconds");
              }}
              onBufferEnd={() => setAvailTrailer(true)}
            />
          </>
        )}
      </div>
      <h1 className="text-2xl font-bold md:text-4xl lg:text-7xl max-w-md lg:max-w-2xl ">
        {movie?.title || movie?.name || movie?.original_name}
      </h1>
      <p className="max-w-xs text-xs md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl text-shadow-sm">
        {movie?.overview && movie?.overview.length > 150 ? (
          <>
            {isFullDescMovie} ...
            <p
              className={`my-3 cursor-pointer ${
                fullDes ? "text-red-400" : "text-gray-400"
              }`}
              onClick={() => setFullDes(!fullDes)}
            >
              {!fullDes ? "Selengkapnya" : "Lihat lebih Sedikit"}
            </p>
          </>
        ) : (
          isFullDescMovie
        )}
      </p>
      <div className="flex space-x-4 ">
        <button className="bannerButton bg-white text-black">
          <FaPlay className="text-black w-4 h-4 md:h-6 md:w-6" /> Play
        </button>

        <button
          className="bannerButton bg-[gray]/70 text-white"
          onClick={() => {
            setShowModal(true);
            setCurrentMovie(movie);
          }}
        >
          <InformationCircleIcon className="w-5 h-5 md:h-8 md:w-8" /> More Info
        </button>
      </div>
    </div>
  );
}

export default Banner;
