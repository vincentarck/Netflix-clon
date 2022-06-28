import React from "react";
import { Movie } from "../typings";
import Image from "next/image";
import { modalState, movieState } from "../atoms/stateAtom";
import { useRecoilState } from "recoil";
import {useRef} from "react"
interface Props {
  movie: Movie;
}
function Thumbnail({ movie }: Props) {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [moviee, setMoviee] = useRecoilState(movieState);
  const tumRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-w-[180px] h-28 relative cursor-pointer transition duration-200 
    ease-out md:h-36 md:min-w-[260px] md:hover:scale-105"
      onClick={() => {
        setMoviee(movie);
        setShowModal(true);
      }}
      ref={tumRef}
    >
      <Image
        src={`https://image.tmdb.org/t/p/w500${
          movie.backdrop_path || movie.poster_path
        }`}
        className="rounded-sm object-cover md:rounded"
        layout="fill"
      />
    </div>
  );
}

export default Thumbnail;
