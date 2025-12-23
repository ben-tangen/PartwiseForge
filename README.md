# 2610 Django + Vite Starting Point
This project serves as a starting point for Django applications that use Vite as the asset server for development. You are welcome to use this project for all of your assignments beginning with Module 5.

## Strategy
This application is a hybrid MPA and SPA. It reuses all of the login stuff that we did at the end of module 3 - there is a separate page for signup/signin. Once a user is logged in they are redirected to the / view which then renders the SPA application created using React and Vite.

## Creating a new application
1. Clone the repo `git clone git@github.com:dittonjs/2610DjangoViteStarter.git <your-new-project-name>`. Replace `<your-new-project-name>` with the name you want give to your project.
   - If you are using GitHub for version control, a better option would be to fork the repository instead of clone it.
3. Open the pyproject.toml file and change the `name` property. You should use `-` to separate words in your name for this property.
4. This project targets Python 3.12 (see `pyproject.toml`). If your local Python version differs and Poetry reports incompatibility, update the version in `pyproject.toml` to match your installed version and regenerate the lock file via `poetry lock --no-update` (or delete `poetry.lock` and run `poetry install`).

## Initial Setup
1. Change the name property in the `pyproject.toml` file to be something unique to your project.
1. In the root directory, install the python dependencies `poetry install --no-root`
2. In the `client` directory, install the javascript dependencies `npm install`
3. In the `_server` directory, create a new file called `.env`
4. Copy the contents of `_server/.env.example` into the newly created `.env` file.
5. Activate the Poetry env `poetry shell`, or use `poetry run <command>` to run commands without activating the shell.
6. In the `_server` directory, run the migrations `python manage.py migrate`

## Running the application
1. In the `client` directory run `npm run dev`
2. In the `_server` directory (with your poetry env activated) run `python manage.py runserver`
3. Visit your application at `http://localhost:8000`

## Automated Setup (recommended)
To set up both backend and frontend automatically, run the included script from the repo root:

```bash
chmod +x ./setup.sh
./setup.sh
```

This will:
- Verify `python3`, `poetry`, and `npm` are available
- Install Python dependencies via Poetry
- Install frontend dependencies in `client/`
- Create `_server/.env` from `_server/.env.example` if missing
- Run Django migrations

Optional: create a Django superuser non-interactively by supplying env vars and the flag:

```bash
DJANGO_SUPERUSER_USERNAME=admin \
DJANGO_SUPERUSER_EMAIL=admin@example.com \
DJANGO_SUPERUSER_PASSWORD=changeme \
./setup.sh --create-superuser
```

After setup, start dev servers:

```bash
(cd client && npm run dev)
poetry run python _server/manage.py runserver
```

## Using this project for future classes/personal projects
Many students in the past have chosen to use this starter app template for projects in other classes like CS3450 and for personal projects. I strongly encourage you to do so! Please check with your other instructors before you use this project as a starting point for their classes. You may also want to add your name to the author field in the `pyproject.toml` file.
