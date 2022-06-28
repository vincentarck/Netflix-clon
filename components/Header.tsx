import React, {
  useEffect,
  useState,
  useRef,
  MouseEvent,
  RefObject,
} from "react";
import { BellIcon, SearchIcon, UserIcon, GlobeIcon, ReplyIcon } from "@heroicons/react/solid";
import Link from "next/link";
import useAuth from "../hooks/useAuth";
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const { logOut, user } = useAuth();
  const profileRef = useRef() as RefObject<HTMLDivElement> | undefined;
  useEffect(() => {
    const handleScrolled = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScrolled);
    return () => {
      window.removeEventListener("scroll", handleScrolled);
    };
  }, []);

  const handleUserInfo = (e:MouseEvent<HTMLDivElement> | undefined) => {
    setShowUser(true);
    let distance = profileRef?.current?.getBoundingClientRect().x! + profileRef?.current?.clientWidth!;
    if(e!.clientX > distance || e!.clientY > distance){
      setShowUser(false)
    }
  };
  return (
    <header className={`${isScrolled && "bg-[#141414]"}`}>
      <div className="flex items-center space-x-4 md:space-x-10">
        <img
          src="https://rb.gy/ulxxee"
          width={100}
          height={100}
          className="cursor-pointer object-contain"
        />
        <ul className="hidden space-x-4 md:flex">
          <li className="headerLink">Home</li>
          <li className="headerLink">Tv Shows</li>
          <li className="headerLink">Movies</li>
          <li className="headerLink">News & Popular</li>
          <li className="headerLink">My List</li>
        </ul>
      </div>
      <div className="flex items-center space-x-4 text-sm font-light relative">
        <SearchIcon className="hidden h-6 w-6 sm:inline" />
        <p className="hidden lg:inline">Kids</p>
        <BellIcon className="h-6 w-6" />
        <div className="relative  w-8 h-8 flex items-center justify-center">
          <div
            className="absolute top-0 right-0"
            onMouseEnter={() => setShowUser(true)}
            onMouseLeave={() => setShowUser(false)}
          >
            <Link href="/">
              <img
                src="https://rb.gy/g1pwyx"
                alt=""
                className="cursor-pointer rounded ml-auto relative z-10"
              />
            </Link>
          </div>

          {showUser && (
            <div
              className="absolute top-[20px] right-0 min-h-[150px] min-w-[200px] "
              ref={profileRef}
              onMouseEnter={() => setShowUser(true)}
              onMouseLeave={() => setShowUser(false)}
            >
              <div className="absolute top-[30px] left-0 right-0 bg-[#141414] 
              rounded-md space-y-3">
                <div className="flex gap-x-2 hover:bg-slate-200/60
                w-full p-2 rounded-sm">
                  <UserIcon className="w-6 h-6" />
                  {user?.displayName}
                </div>
                <div className="flex rounded-sm gap-x-2 hover:bg-slate-200/60 p-2">
                  <GlobeIcon className="w-6 h-6"/>
                  Settings
                </div>
                
                <div className="flex rounded-sm gap-x-2 hover:bg-slate-200/60 p-2" onClick={() => logOut()}>
                  <ReplyIcon className="w-6 h-6"/>
                  Logout
                </div>
              </div>
            </div>
           )} 
        </div>
      </div>
    </header>
  );
}

export default Header;
