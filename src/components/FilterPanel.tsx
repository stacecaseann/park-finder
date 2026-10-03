import { filterCategories } from "../data/filterDefinitions";

interface FilterPanelProps {
  selectedFilterIds: string[];
  onToggle: (id: string) => void;
}

/**
 * Checkbox filter groups generated from the centralized
 * filterCategories structure. Rendered as the desktop sidebar
 * and inside the mobile filters panel.
 */
function FilterPanel({ selectedFilterIds, onToggle }: FilterPanelProps) {
  return (
    <div className="filter-panel">
      {filterCategories.map((category) => (
        <fieldset key={category.id} className="filter-group">
          <legend>{category.label}</legend>
          {category.filters.map((filter) => (
            <div key={filter.id} className="filter-option">
              <input
                type="checkbox"
                id={`filter-${filter.id}`}
                checked={selectedFilterIds.includes(filter.id)}
                onChange={() => onToggle(filter.id)}
              />
              <label htmlFor={`filter-${filter.id}`}>{filter.label}</label>
            </div>
          ))}
        </fieldset>
      ))}
    </div>
  );
}

export default FilterPanel;
