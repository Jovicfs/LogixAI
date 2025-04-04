import logging
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Text, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

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
        connection.execute(text("SELECT 1"))
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

class Logo(Base):
    __tablename__ = 'logos'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    company_name = Column(String, nullable=False)
    sector = Column(String)
    style = Column(String)
    color = Column(String)
    image_url = Column(String, nullable=False)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

class Image(Base):
    __tablename__ = 'images'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    prompt = Column(String, nullable=False)
    style = Column(String)
    image_url = Column(String, nullable=False)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

class Video(Base):
    __tablename__ = 'videos'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    prompt = Column(String, nullable=False)
    style = Column(String)
    video_url = Column(String, nullable=False)
    duration = Column(Integer)  # Duration in seconds
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

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
        logger.info(f"Usuário {username} criado com sucesso.")
        return user
    except Exception as e:
        session.rollback()
        logger.exception(f"Erro ao criar usuário {username}: {e}")
        return None
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

def save_logo(user_id, company_name, sector, style, color, image_url):
    session = SessionLocal()
    try:
        logo = Logo(
            user_id=user_id,
            company_name=company_name,
            sector=sector,
            style=style,
            color=color,
            image_url=image_url
        )
        session.add(logo)
        session.commit()
        # Get all necessary data before closing the session
        logo_data = {
            'id': logo.id,
            'image_url': logo.image_url,
            'company_name': logo.company_name,
            'created_at': logo.created_at
        }
        return logo_data
    except Exception as e:
        session.rollback()
        logger.exception(f"Error saving logo: {e}")
        return None
    finally:
        session.close()

def get_user_logos(user_id):
    session = SessionLocal()
    try:
        logos = session.query(Logo).filter(Logo.user_id == user_id).all()
        return logos
    except Exception as e:
        logger.exception(f"Error fetching logos: {e}")
        return []
    finally:
        session.close()

def delete_logo(logo_id, user_id):
    session = SessionLocal()
    try:
        logo = session.query(Logo).filter(Logo.id == logo_id, Logo.user_id == user_id).first()
        if logo:
            session.delete(logo)
            session.commit()
            return True
        return False
    except Exception as e:
        session.rollback()
        logger.exception(f"Error deleting logo: {e}")
        return False
    finally:
        session.close()

def save_image(user_id, prompt, style, image_url):
    session = SessionLocal()
    try:
        image = Image(
            user_id=user_id,
            prompt=prompt,
            style=style,
            image_url=image_url
        )
        session.add(image)
        session.commit()
        image_data = {
            'id': image.id,
            'image_url': image.image_url,
            'prompt': image.prompt,
            'created_at': image.created_at
        }
        return image_data
    except Exception as e:
        session.rollback()
        logger.exception(f"Error saving image: {e}")
        return None
    finally:
        session.close()

def get_user_images(user_id):
    session = SessionLocal()
    try:
        images = session.query(Image).filter(Image.user_id == user_id).all()
        return images
    except Exception as e:
        logger.exception(f"Error fetching images: {e}")
        return []
    finally:
        session.close()

def delete_image(image_id, user_id):
    session = SessionLocal()
    try:
        image = session.query(Image).filter(Image.id == image_id, Image.user_id == user_id).first()
        if image:
            session.delete(image)
            session.commit()
            return True
        return False
    except Exception as e:
        session.rollback()
        logger.exception(f"Error deleting image: {e}")
        return False
    finally:
        session.close()

def save_video(user_id, prompt, style, video_url, duration=None):
    session = SessionLocal()
    try:
        video = Video(
            user_id=user_id,
            prompt=prompt,
            style=style,
            video_url=video_url,
            duration=duration
        )
        session.add(video)
        session.commit()
        video_data = {
            'id': video.id,
            'video_url': video.video_url,
            'prompt': video.prompt,
            'created_at': video.created_at
        }
        return video_data
    except Exception as e:
        session.rollback()
        logger.exception(f"Error saving video: {e}")
        return None
    finally:
        session.close()

def get_user_videos(user_id, video_id=None):
    session = SessionLocal()
    try:
        if (video_id):
            return session.query(Video).filter(
                Video.user_id == user_id,
                Video.id == video_id
            ).first()
        return session.query(Video).filter(Video.user_id == user_id).all()
    except Exception as e:
        logger.exception(f"Error fetching videos: {e}")
        return [] if video_id is None else None
    finally:
        session.close()

def delete_video(video_id, user_id):
    session = SessionLocal()
    try:
        video = session.query(Video).filter(
            Video.id == video_id,
            Video.user_id == user_id
        ).first()
        if video:
            session.delete(video)
            session.commit()
            return True
        return False
    except Exception as e:
        session.rollback()
        logger.exception(f"Error deleting video: {e}")
        return False
    finally:
        session.close()

init_db()