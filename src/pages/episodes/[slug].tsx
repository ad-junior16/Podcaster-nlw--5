import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { api } from '../../services/api'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import Link from 'next/link'

import styles from './episodes.module.scss'
import { usePlayer } from '../../contexts/playerContext'
import { Header } from '../../components/Header'
import Head from 'next/head'



type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAT: string;
}

type EpisodeProps = {
    episode: Episode

}




export default function Episode({ episode }: EpisodeProps) {
    const router = useRouter()

    const { play } = usePlayer()

    return (
        <div className={styles.episode}>

            <Head>
                <title> {episode.title} | Podcastr</title>

            </Head>
            <div className={styles.thumbnailcontainer}>
                <Link href='/'>
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar Episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAT}</span>
                <span>{episode.durationAsString}</span>

            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />

        </div>
    )
}


export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })


    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {

        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAT: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24   //24 horas
    }
}