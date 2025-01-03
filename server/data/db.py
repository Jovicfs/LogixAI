import logging
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Text, text  # Import 'text'
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from werkzeug.security import generate_password_hash, check_password_hash

# Configuração do Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Carregar variáveis de ambiente
load_dotenv()

# Configurações do banco de dados
DATABASE_URL = os.getenv('DATABASE_URL')

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))  # Correção: text("SELECT 1") com 't' minúsculo
    logger.info("Conexão com o banco de dados estabelecida com sucesso.")
except OperationalError as e:
    logger.error(f"Erro ao conectar com o banco de dados: {e}")
    raise SystemExit("Falha crítica na conexão com o banco de dados.") from e
except Exception as e:
    logger.exception(f"Um erro inesperado ocorreu na inicialização do banco de dados: {e}")
    raise SystemExit("Erro na inicialização do banco de dados.") from e

Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    token = Column(Text, nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Tabelas do banco de dados criadas (se necessário).")
    except Exception as e:
        logger.exception(f"Erro ao criar as tabelas do banco de dados: {e}")
        raise

def get_user_by_username(username):
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.username == username).first()
        if user:
            logger.debug(f"Usuário {username} encontrado.")
        else:
            logger.debug(f"Usuário {username} não encontrado.")
        return user
    except Exception as e:
        logger.exception(f"Erro ao buscar usuário por nome de usuário: {e}")
        return None
    finally:
        session.close()

def create_user(username, email, password):
    session = SessionLocal()
    try:
        user = User(username=username, email=email)
        user.set_password(password)
        session.add(user)
        session.commit()
        logger.info(f"Usuário {username} criado com sucesso.") # Log de sucesso
        return user
    except Exception as e:
        session.rollback()
        logger.exception(f"Erro ao criar usuário {username}: {e}")
        return None # Importante retornar None em caso de erro
    finally:
        session.close()

def update_user_token(username, token):
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.username == username).first()
        if user:
            user.token = token
            session.commit()
            logger.info(f"Token do usuário {username} atualizado.")
            return user
        else:
            logger.warning(f"Usuário {username} não encontrado ao atualizar o token.")
            return None
    except Exception as e:
        session.rollback()
        logger.exception(f"Erro ao atualizar token do usuário {username}: {e}")
        return None
    finally:
        session.close()

def verify_token(token):
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.token == token).first()
        if user:
            logger.debug(f"Token {token} verificado para o usuário {user.username}.")
            return user
        else:
            logger.debug(f"Token {token} não encontrado.")
            return None
    except Exception as e:
        logger.exception(f"Erro ao verificar token: {e}")
        return None
    finally:
        session.close()


init_db()