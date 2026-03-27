import { FaSearch } from 'react-icons/fa'
import "../../Styles/Filters.css"
import { useEffect, useRef } from 'react'

function Search({ search, setSearch }) {
    const searchRef = useRef()

    useEffect(() => {
        searchRef.current?.focus();
    }, []);

    return (
        <form className="search">
            <button type='button' className='search-button'><FaSearch color='#333' /></button>
            <input ref={searchRef} type="text" className="search-input" value={search} onChange={setSearch} placeholder='Search Users' />
        </form>
    )
}

export default Search