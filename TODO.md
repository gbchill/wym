# WYM TODO

This checklist tracks the MVP and next steps for WYM budget and spend insights.

## MVP

- [ ] Add Capital One CSV parser parallel to `backend/parsers/credit_card.py` with normalized fields.
- [ ] Add common normalization for date, description, amount, reference id across bank exports.
- [ ] Decide and implement source tagging in `Transaction` (e.g., `bank_name` or metadata).
- [ ] Add rule-based categorizer (keyword -> category) with editable mapping.
- [ ] Track and report "uncategorized" rate.
- [ ] Aggregate monthly totals: spend, income, net.
- [ ] Compute top categories and top merchants per month.
- [ ] Identify "where I'm losing money" as top negative net categories.
- [ ] Add month-over-month category changes.
- [ ] Detect category spikes or outliers.
- [ ] Recommend budgets from trailing 3 months (median or average + buffer).
- [ ] Add CLI entry point to ingest CSVs and generate Markdown reports.
- [ ] Define CLI args for input folder, month selection, and output folder.
- [ ] Produce Markdown report sections: overview, category spend table, top merchants, trends, budget recommendations.
- [ ] Update `README.md` with usage, inputs, outputs, and an example command.

## Next

- [ ] Add per-merchant learned categories with override rules.
- [ ] Add simple visualization output (CSV/JSON for charts or ASCII charts in Markdown).

## Tests and Validation

- [ ] Bank of America CSV sample parses correctly.
- [ ] Capital One CSV sample parses correctly.
- [ ] Categorizer maps known keywords to categories.
- [ ] Unmatched entries default to "uncategorized".
- [ ] Month grouping works across year boundaries.
- [ ] Spend totals and net calculations are correct.
- [ ] Markdown report contains all expected sections.
- [ ] Empty month or missing data handled gracefully.

## Out of Scope

- OFX/QFX import.
- Web UI beyond CLI + Markdown output.
- Multi-currency support.
