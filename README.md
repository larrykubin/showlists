# Install Dependencies

```
pip install -r requirements
```

# Running the app

```
uvicorn main:app --reload
```

* Easy to set up - pip install and run
* Autoreload server - uvicorn
* Type annotations for validating parameters - pydantic
* Autodocumentation, OpenAPI, Standards - /docs

# Tests

```
docker-compose exec web pytest .
```