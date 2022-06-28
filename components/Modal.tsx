import { useRecoilState } from "recoil";
import { modalState, movieState, readyPlayTrailer } from "../atoms/stateAtom";
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Movie, Element } from "../typings";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";
import { Genre } from "../typings";
import {
  CheckIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from "@heroicons/react/outline";

function MuiModal() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [availTrailer, setAvailTrailer] = useRecoilState(readyPlayTrailer);
  const [trailerMovie, setTrailerMovie] = useState("");
  const [genre, setGenre] = useState("");
  const [muted, setMuted] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie | null>(null);
  useEffect(() => {
    if (!movie) return;
    async function fetchTrailerMovie() {
      const res = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      ).then((res) => res.json());

      if (res?.videos) {
        const index = res.videos?.results.findIndex((video: Element) => {
          return video.type === "Trailer";
        });
        index > -1 && setTrailerMovie(res.videos.results[index].key);
      }
      if (res?.genres) {
        setGenres(res.genres);
      }
    }

    fetchTrailerMovie();
  }, [movie]);
  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <Modal
      open={showModal}
      onClose={handleClose}
      className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full 
      max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide max-h-100vh
      "
    >
      <>
        <button
          className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
          onClick={handleClose}
        >
          <XIcon className="h-6 w-6" />
        </button>

        <div className={`relative flex items-center justify-center text-lg
         w-full h-[56.25%]  bg-black`}>
        {availTrailer ? "Loading ...." : "Video Not Found"}
        <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailerMovie}`}
            width="100%"
            height="100%"
            style={{ position: "absolute", top: "0", left: "0" }}
            playing
            muted={muted}
            onPlay={() => setAvailTrailer(true)}
          />
          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              <button className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]">
                <FaPlay className="h-7 w-7 text-black" />
                Play
              </button>
              <button className="modalButton">
                <ThumbUpIcon className="h-6 w-6" />
              </button>
            </div>
            <button className="modalButton" onClick={() => setMuted(!muted)}>
              {muted ? (
                <VolumeOffIcon className="h-6 w-6" />
              ) : (
                <VolumeUpIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
          <div className="space-y-6 text-lg">
            <div className="flex items-center space-x-2 text-sm">
              <p className="font-semibold text-green-400">
                {movie!.vote_average * 10}% Match
              </p>
              <p className="font-light">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                HD
              </div>
            </div>
            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-4/6">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genres:</span>{" "}
                  {genres.map((genre) => genre.name).join(", ")}
                </div>

                <div>
                  <span className="text-[gray]">Original language:</span>{" "}
                  {movie?.original_language}
                </div>

                <div>
                  <span className="text-[gray]">Total votes:</span>{" "}
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
}

export default MuiModal;
