"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Filter, Search, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterOption {
    value: string
    label: string
}

interface FilterConfig {
    label?: string
    value: string
    onChange: (value: string) => void
    options: FilterOption[]
    width?: string
}

interface FilterSearchCardProps {
    title?: string
    searchPlaceholder?: string
    searchValue: string
    onSearchChange: (value: string) => void
    filters?: FilterConfig[]
    isSearching?: boolean
}

const FilterSearchCard: React.FC<FilterSearchCardProps> = ({
    title = "Filtros e Busca",
    searchPlaceholder = "Buscar...",
    searchValue,
    onSearchChange,
    filters = [],
    isSearching = false,
}) => {
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>{title}</span>
                    {isSearching && (
                        <Loader2 className="h-4 w-4 animate-spin text-[#F9CD1D] loading-spinner" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Campo de busca */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            {searchValue && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                                    onClick={() => onSearchChange("")}
                                >
                                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                </Button>
                            )}
                        </div>
                        {searchValue && (
                            <p className="text-xs text-gray-500 mt-1">
                                Pesquisando por: <span className="font-medium">{searchValue}</span>
                            </p>
                        )}
                    </div>

                    {/* Filtros dinâmicos */}
                    <div className="flex gap-4">
                        {filters.map((filter, index) => (
                            <div key={index} className={filter.width || "w-48"}>
                                <Select value={filter.value} onValueChange={filter.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={filter.label || "Filtro"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filter.options.map((option: FilterOption) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FilterSearchCard
