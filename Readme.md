# API Documentation

## Deployment Guidelines

Follow these steps to deploy the application:

1. **Build the Application:**
   - First, you need to build the project by running:
     ```bash
     yarn build
     ```

2. **Set aws creds on awscli:**
    - set AWS_ACCESS_KEY_ID=test
    - set AWS_SECRET_ACCESS_KEY=test
    - set AWS_DEFAULT_REGION=us-east-1
    - set LOCALSTACK_HOSTNAME=localhost
    - set AWS_ENDPOINT_URL=http://localhost:4566
3. **Deploy the Application:**
   - Once the build is complete, deploy the application on localstack by running:
     ```bash
     yarn deploy:localstack
     ```

---

## Continuous Integration & Continuous Deployment (CICD)

With the CICD setup, the following actions will be automatically performed whenever you push changes to the `main` branch:

- **Linting:** Automatically run lint checks.
- **Unit Tests:** Automatically run the unit tests to ensure the code behaves as expected.
- **Build:** Automatically build the project.
- **Deployment:** Automatically deploy the project to the AWS environment.



---

