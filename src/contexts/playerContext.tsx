import { createContext, useState, ReactNode, useContext } from 'react'


type Episode = {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

type PlayerContextData = {
    episodeList: Episode[]
    currentEpisodeIndex: number
    isPlaying: boolean
    play: (episode: Episode) => void
    PlayList: (episode: Episode[], index: number) => void
    toggleplay: () => void
    PlayNext: () => void
    PlayPrevious: () => void
    setPlayingState: (state: boolean) => void
    hasNext: boolean
    hasPrevious: boolean
    toggleLoop: () => void
    isLooping: boolean
    toggleShuffle: () => void
    isShuffling: boolean
    clearPlayerState: () => void
};

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children: ReactNode


}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0);
        setIsPlaying(true)
    }

    function PlayList(list: Episode[], index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index);
        setIsPlaying(true)

    }

    function toggleplay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop() {
        setIsLooping(!isLooping)
    }
    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function clearPlayerState (){
        setEpisodeList([])
        setCurrentEpisodeIndex(0)

    }

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    function PlayNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    function PlayPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                isPlaying,
                PlayNext,
                PlayPrevious,
                toggleplay,
                setPlayingState,
                PlayList,
                hasNext,
                hasPrevious,
                toggleLoop,
                isLooping,
                toggleShuffle,
                isShuffling,
                clearPlayerState
            }}>
            {children}
        </PlayerContext.Provider>

    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)

}