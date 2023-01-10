import { signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  const {data:session,status} = useSession();
  console.log(session);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="A template for nextjs with tailwindcss" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
        <h1 className="text-4xl font-bold text-center">
          Welcome to <a href="https://nextjs.org">Next.js</a>
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              signOut()
            }}
          >
              logout
          </button>
        </h1>
      </main>

    </div>
  )
}