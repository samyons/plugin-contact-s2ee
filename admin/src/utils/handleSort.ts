function handleSort<T>(
    items: T[],
    setItems: (items: T[]) => void,
    setSortBy: (name: string) => void,
    setSortOrder: (order: 'ASC' | 'DESC') => void,
    name: string,
    order: 'ASC' | 'DESC'
) {
    setSortBy(name);
    setSortOrder(order);

    const sortedItems = [...items].sort((a, b) => {
        const aValue = a[name as keyof T];
        const bValue = b[name as keyof T];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return order === 'ASC'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return 0;
    });

    setItems(sortedItems);
}

export { handleSort }; 