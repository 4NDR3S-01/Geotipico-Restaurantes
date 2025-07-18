import { useState, useEffect, useCallback, useMemo } from 'react';

const useFilters = (initialSearch = '', initialCategory = 'restaurant') => {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Debounce search para evitar excesivas llamadas a la API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Funciones memoizadas para evitar re-renders innecesarios
  const updateSearch = useCallback((newSearch) => {
    setSearch(newSearch);
  }, []);

  const updateCategory = useCallback((newCategory) => {
    setCategory(newCategory);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('restaurant');
  }, []);

  // Objeto de filtros memoizado
  const filters = useMemo(() => ({
    search: debouncedSearch,
    category,
    rawSearch: search
  }), [debouncedSearch, category, search]);

  return {
    filters,
    updateSearch,
    updateCategory,
    clearFilters,
    isSearching: search !== debouncedSearch
  };
};

export default useFilters;
