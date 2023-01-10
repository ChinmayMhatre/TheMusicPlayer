import React from "react";
import { getProviders, signIn } from "next-auth/react";

const Login = ({ providers }) => {
   return (
      <div className="flex flex-col items-center bg-black justify-center min-h-screen text-center">
         <h1 className="text-4xl text-white font-bold">Login</h1>
         <div className="flex flex-col items-center justify-center mt-10">
            {Object.values(providers).map((provider) => (
               <div key={provider.name}>
                  <button
                     className="px-4 py-2 mt-4 text-white bg-[#18d860] font-bold rounded-md"
                     onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                  >
                     Sign in with {provider.name}
                  </button>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Login;

export async function getServerSideProps() {
   const providers = await getProviders();
   return {
      props: {
         providers,
      },
   };
}
