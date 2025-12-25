#!/bin/zsh

# Go to the results folder
cd tests/performance/results/ || exit

# Find the latest combined JTL
latest_combined_jtl=$(ls -t combined_*.jtl 2>/dev/null | head -1)

# Find the latest combined report folder
latest_combined_report=$(ls -td report_combined_* 2>/dev/null | head -1)

echo "Latest combined JTL: $latest_combined_jtl"
echo "Latest combined report: $latest_combined_report"

# Delete old combined JTLs except the latest
for file in combined_*.jtl; do
  if [[ "$file" != "$latest_combined_jtl" ]]; then
    echo "Deleting old combined JTL: $file"
    rm -f "$file"
  fi
done

# Delete old combined report folders except the latest
for dir in report_combined_*; do
  if [[ "$dir" != "$latest_combined_report" ]]; then
    echo "Deleting old combined report folder: $dir"
    rm -rf "$dir"
  fi
done

echo "Cleanup completed. Only the latest combined files remain."
