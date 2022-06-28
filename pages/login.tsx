import React from "react";
import Head from "next/head";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { Interface } from "readline";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
interface Inputs {
  email: string;
  password: string;
  username:string;

}
function login() {
  const [login, setLogin] = useState(false);
  const { signIn, signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async ({ email, password, username }) => {
    if (login) {
      await signIn(email, password);
    } else {
      await signUp(email, password, username);
    }
  };
  return (
    <div
      className="relative flex flex-col w-screen h-screen md:items-center 
    md:justify-center md:bg-transparent bg-black"
    >
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src="https://rb.gy/p2hphi"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
      />
      <img
        src="https://rb.gy/ulxxee"
        width={150}
        height={150}
        className="cursor-pointer object-contain absolute left-4 top-4 
          md:left-10 md:top-6"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-24 space-y-4 mx-4 md:bg-[#141414]/75 md:rounded md:p-10 md:w-2/5"
      >
        <h1 className="md:text-3xl">Sign In</h1>
        <div className="space-y-3 flex flex-col md:w-full ">
        <label htmlFor="" placeholder="Username">
            <input
              type="text"
              className="input"
              placeholder="Username"
              {...register("username", { required: true })}
            />

            {errors.username && (
              <p className="p-1 font-light text-sm text-orange-600">
                Please Enter a valid username
              </p>
            )}
          </label>
          <label htmlFor="" placeholder="Email">
            <input
              type="email"
              className="input"
              placeholder="Email"
              {...register("email", { required: true })}
            />

            {errors.password && (
              <p className="p-1 font-light text-sm text-orange-600">
                Please Enter a valid Email
              </p>
            )}
          </label>
          <label htmlFor="" placeholder="Password">
            <input
              type="password"
              className="input"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="p-1 font-light text-sm text-orange-600">
                Please Enter a valid Password
              </p>
            )}
          </label>
        </div>
        <button
          className="w-full rounded bg-red-600 flex items-center justify-center py-2"
          onClick={() => setLogin(true)}
        >
          Sign In
        </button>
        <div className="text-[gray]">
          New To Netflix{" "}
          <button
            type="submit"
            className="hover:underline text-white"
            onClick={() => setLogin(false)}
          >
            {" "}
            Sign Up Now
          </button>
        </div>
      </form>
    </div>
  );
}

export default login;
