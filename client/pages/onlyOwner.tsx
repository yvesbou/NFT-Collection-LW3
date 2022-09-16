import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';


const OnlyOwner: NextPage = () => {
    return(
        <main className={styles.main}>
            <Navbar/>
            <h1>This is the Only Owner Page</h1>     
        </main>
    );
}

export default OnlyOwner;