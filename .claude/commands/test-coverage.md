Run frontend unit tests with V8 coverage report.

Steps:
1. Run `make fe-test-coverage` from the project root
2. Analyze the coverage output
3. Report files below thresholds (70% statements/functions/lines, 65% branches)
4. Suggest which untested areas would have the highest impact if covered
