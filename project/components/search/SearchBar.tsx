'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, onFilterChange, placeholder }: SearchBarProps) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<string[]>([]);

  const filterOptions = [
    { id: 'restaurant', label: t('search.filter.restaurant') },
    { id: 'fast_food', label: t('search.filter.fast_food') },
    { id: 'cafe', label: t('search.filter.cafe') },
    { id: 'bar', label: t('search.filter.bar') },
    { id: 'pizza', label: t('search.filter.pizza') },
    { id: 'seafood', label: t('search.filter.seafood') },
    { id: 'italian', label: t('search.filter.italian') },
    { id: 'chinese', label: t('search.filter.chinese') },
    { id: 'mexican', label: t('search.filter.mexican') },
    { id: 'vegetarian', label: t('search.filter.vegetarian') },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleFilterToggle = (filterId: string) => {
    const newFilters = filters.includes(filterId)
      ? filters.filter(f => f !== filterId)
      : [...filters, filterId];
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex space-x-2" role="search" aria-label="Buscar restaurantes">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
          <Input
            type="text"
            placeholder={placeholder || t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            aria-label="Campo de búsqueda de restaurantes"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              aria-label={`Filtros de búsqueda${filters.length > 0 ? `, ${filters.length} filtros activos` : ''}`}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              {filters.length > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs flex items-center justify-center"
                  aria-hidden="true"
                >
                  {filters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" role="dialog" aria-label="Panel de filtros">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold" id="filters-heading">{t('search.filters')}</h3>
                {filters.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    aria-label="Limpiar todos los filtros"
                  >
                    <X className="h-4 w-4 mr-1" aria-hidden="true" />
                    Limpiar
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3" role="group" aria-labelledby="filters-heading">
                {filterOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.includes(option.id)}
                      onCheckedChange={() => handleFilterToggle(option.id)}
                      aria-describedby={`${option.id}-label`}
                    />
                    <label
                      htmlFor={option.id}
                      id={`${option.id}-label`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </form>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Filtros activos">
          {filters.map((filter) => {
            const option = filterOptions.find(opt => opt.id === filter);
            return (
              <Badge key={filter} variant="secondary" className="text-xs" role="listitem">
                {option?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => handleFilterToggle(filter)}
                  aria-label={`Quitar filtro ${option?.label}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};