import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi,{ LOGIN_URL } from "../../../lib/spotify";

const refreshAccessToken = async (token) => {
   try {
      spotifyApi.setAccessToken(token.accessToken);
      spotifyApi.setRefreshToken(token.refreshToken);
      const data = await spotifyApi.refreshAccessToken();
      const { body } = data;
      return {
         ...token,
         accessToken: body.access_token,
         accessTokenExpires: Date.now() + body.expires_in * 1000,
         refreshToken: body.refresh_token ?? token.refreshToken,
      };
      
   } catch (error) {
      console.log(error);
      return {
         ...token,
         error: "RefreshAccessTokenError"
      }
   }
};

export const authOptions = {
   // Configure one or more authentication providers
   providers: [
      SpotifyProvider({
         clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
         clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
         authorization: LOGIN_URL,
      }),
      // ...add more providers here
   ],
   secret: process.env.JWT_SECRET,
   pages: {
      signIn: "/login",
   },
   callbacks: {
      async jwt({token, user, account}) {
         // initial login
         if (user && account) {
            console.log("initial login");
            return {
               ...token,
               accessToken: account.access_token,
               refreshToken: account.refresh_token,
               username: account.providerAccountId,
               accessTokenExpires: account.expires_at * 1000,
            };
         }
         // Return prev token if access token has not expired
         if (token.accessTokenExpires > Date.now()) {
            console.log("return prev token");
            return token;
         }
         // Refresh token if access token has expired
         console.log(account + "hereee account" );
         console.log(user + "hereee user" );

         return await refreshAccessToken(token);
      },
      async session({session, token}) {
         // Add property to session, like an access_token from a provider.
         session.user.accessToken = token.accessToken;
         session.user.refreshToken = token.refreshToken;
         session.user.username = token.username;
         return session;
      }
   },
};
export default NextAuth(authOptions);
