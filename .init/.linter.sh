#!/bin/bash
cd /home/kavia/workspace/code-generation/login-functionality-test-suite-43848-43862/playwright_test_runner
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

