import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';


const OnlyOwner: NextPage = () => {
    return(
        <main className={styles.main}>
            <Navbar/>        
        </main>
    );
}