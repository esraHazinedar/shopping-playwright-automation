#!/bin/zsh
set -e  # Stop on any error

# -----------------------------
# run_performance.sh
# -----------------------------

# Project paths
RESULTS_DIR="tests/performance/results"
TEST_PLAN="tests/performance/test-plans/add-to-cart.jmx"

# Current date
TODAY=$(date +%F)

# Create daily folder for results
DAILY_COMBINED_DIR="$RESULTS_DIR/combined_$TODAY"
mkdir -p "$DAILY_COMBINED_DIR"

# Create a subfolder for all runs today
RUNS_DIR="$DAILY_COMBINED_DIR/runs"
mkdir -p "$RUNS_DIR"

# -----------------------------
# Run JMeter test plan
# -----------------------------
echo "Running JMeter test plan..."
TIMESTAMP=$(date +%s)

# Create a subfolder for this run
RUN_DIR="$RUNS_DIR/run_$TIMESTAMP"
mkdir -p "$RUN_DIR"

INDIVIDUAL_JTL="$RUN_DIR/results.jtl"
INDIVIDUAL_REPORT="$RUN_DIR/report"

jmeter -n -t "$TEST_PLAN" \
       -l "$INDIVIDUAL_JTL" \
       -Jjmeter.save.saveservice.timestamp_format=ms \
       -e -o "$INDIVIDUAL_REPORT"

echo "Individual report generated at $INDIVIDUAL_REPORT"

# -----------------------------
# Combine all JTL files of today (overwrite if exist)
# -----------------------------
COMBINED_JTL="$DAILY_COMBINED_DIR/combined_today.jtl"
COMBINED_REPORT="$DAILY_COMBINED_DIR/report_combined_today"

# Remove previous combined files for today
rm -f "$COMBINED_JTL"
rm -rf "$COMBINED_REPORT"

echo "Combining all JTL files of today into $COMBINED_JTL..."
first_file=true
for file in "$RUNS_DIR"/run_*/results.jtl; do
    if [ "$first_file" = true ]; then
        cat "$file" > "$COMBINED_JTL"
        first_file=false
    else
        tail -n +2 "$file" >> "$COMBINED_JTL"
    fi
done

# -----------------------------
# Generate combined report
# -----------------------------
echo "Generating combined report at $COMBINED_REPORT..."
jmeter -g "$COMBINED_JTL" -o "$COMBINED_REPORT"

# Open the combined report if it exists
if [ -f "$COMBINED_REPORT/index.html" ]; then
  open "$COMBINED_REPORT/index.html"
else
  echo "Warning: index.html not found in $COMBINED_REPORT"
fi

# -----------------------------
# Optional: keep last 5 combined reports
# -----------------------------
echo "Cleaning old combined reports, keeping last 5..."
ls -td "$DAILY_COMBINED_DIR"/report_* 2>/dev/null | tail -n +6 | xargs -I {} rm -rf {}

# -----------------------------
# Optional: clean old runs older than 7 days
# -----------------------------
echo "Cleaning run folders older than 7 days..."
find "$RESULTS_DIR"/combined_*/runs/run_* -type d -mtime +7 -exec rm -rf {} +

echo "Run complete."

