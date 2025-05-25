import logging
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid

# Configuração do Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Carregar variáveis de ambiente
load_dotenv()

# Configurações do banco de dados
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    logger.error("DATABASE_URL not found in environment variables")
    raise ValueError("DATABASE_URL is required")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))  # Changed from Text to text
        connection.commit()
    logger.info("Database connection established successfully.")
except OperationalError as e:
    logger.error(f"Database connection error: {e}")
    raise SystemExit("Critical database connection failure.") from e
except Exception as e:
    raise SystemExit("Erro na inicialização do banco de dados.") from e

Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
 

 #Models
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

class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, nullable=False, default='pending')
    external_reference = Column(String, unique=True)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    updated_at = Column(String, default=lambda: datetime.utcnow().isoformat())

class ChatMessage(Base):
    __tablename__ = 'chat_messages'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    conversation_id = Column(String(36), default=lambda: str(uuid.uuid4()), nullable=False)
    role = Column(String, nullable=False)  # "user" ou "assistant"
    content = Column(Text, nullable=False)
    image_path = Column(String(255), nullable=True)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())
    

class PostGenerator(Base):
    __tablename__ = 'chat_messages_post_generator'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    post_id = Column(String(36), default=lambda: str(uuid.uuid4()), nullable=False)
    role = Column(String, nullable=False)  # "user" ou "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

class Post(Base):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    topic = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    format = Column(String(50))
    tone = Column(String(50))
    word_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

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


        #Functions for Logo, Image, Payment, and ChatMessage, and PostGenerator


def get_user_post(user_id,post_id):
    session = SessionLocal()
    try:
        post = session.query(PostGenerator).filter(
            PostGenerator.user_id == user_id,
            PostGenerator.post_id == post_id
        ).first()
        if post:
            return {
                'id': post.id,
                'post_id': post.post_id,
                'role': post.role,
                'content': post.content,
                'created_at': post.created_at
            }
        return None
    except Exception as e:
        logger.exception(f"Error fetching user post: {e}")
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

def create_payment(user_id, amount):
    session = SessionLocal()
    try:
        payment = Payment(
            user_id=user_id,
            amount=amount,
            external_reference=str(uuid.uuid4())
        )
        session.add(payment)
        session.commit()
        return {
            'id': payment.id,
            'amount': payment.amount,
            'status': payment.status,
            'external_reference': payment.external_reference
        }
    except Exception as e:
        session.rollback()
        logger.exception(f"Error creating payment: {e}")
        return None
    finally:
        session.close()

def update_payment_status(external_reference, status):
    session = SessionLocal()
    try:
        payment = session.query(Payment).filter(
            Payment.external_reference == external_reference
        ).first()
        if payment:
            payment.status = status
            payment.updated_at = datetime.utcnow().isoformat()
            session.commit()
            return True
        return False
    except Exception as e:
        session.rollback()
        logger.exception(f"Error updating payment status: {e}")
        return False
    finally:
        session.close()

def get_user_payment_status(user_id):
    session = SessionLocal()
    try:
        payment = session.query(Payment).filter(
            Payment.user_id == user_id,
            Payment.status == 'approved'
        ).first()
        return payment is not None
    except Exception as e:
        logger.exception(f"Error checking payment status: {e}")
        return False
    finally:
        session.close()

def get_payment_by_reference(external_reference):
    session = SessionLocal()
    try:
        payment = session.query(Payment).filter(
            Payment.external_reference == external_reference
        ).first()
        if payment:
            return {
                'id': payment.id,
                'user_id': payment.user_id,
                'amount': payment.amount,
                'status': payment.status,
                'created_at': payment.created_at
            }
        return None
    except Exception as e:
        logger.exception(f"Error fetching payment: {e}")
        return None
    finally:
        session.close()

def save_chat_message(user_id, role, content, **kwargs):
    session = SessionLocal()
    try:
        if not isinstance(user_id, int):
            raise ValueError(f"Invalid user_id type: {type(user_id)}")
        
        if not content:
            raise ValueError("Content cannot be empty")
            
        if role not in ['user', 'assistant']:
            raise ValueError(f"Invalid role: {role}")

        conversation_id = kwargs.get('conversation_id')
        if not conversation_id:
            conversation_id = str(uuid.uuid4())
        elif not isinstance(conversation_id, str):
            conversation_id = str(conversation_id)

        logger.debug(f"Creating ChatMessage: user_id={user_id}, role={role}, conv_id={conversation_id}")
        
        message = ChatMessage(
            user_id=user_id,
            role=role,
            content=content,
            conversation_id=conversation_id,
            image_path=kwargs.get('image_path')
        )
        
        session.add(message)
        session.flush()  # Flush to get the ID without committing
        logger.debug(f"Message flushed with ID: {message.id}")
        
        session.commit()
        logger.info(f"Message committed successfully: id={message.id}")

        return {
            'id': message.id,
            'conversation_id': message.conversation_id,
            'role': message.role,
            'content': message.content,
            'image_path': message.image_path,
            'created_at': message.created_at
        }
        
    except Exception as e:
        session.rollback()
        logger.exception(f"Error in save_chat_message: {str(e)}")
        raise
    finally:
        session.close()

def get_chat_history(user_id):
    session = SessionLocal()
    try:
        # Get unique conversation IDs
        conversations = session.query(ChatMessage.conversation_id)\
            .filter(ChatMessage.user_id == user_id)\
            .distinct()\
            .all()

        history = []
        for (conv_id,) in conversations:
            messages = session.query(ChatMessage)\
                .filter(
                    ChatMessage.user_id == user_id,
                    ChatMessage.conversation_id == conv_id
                )\
                .order_by(ChatMessage.created_at.asc())\
                .all()
            if messages:
                history.append({
                    'id': conv_id,
                    'messages': [{
                        'role': msg.role,
                        'content': msg.content,
                        'image_path': msg.image_path,
                        'created_at': msg.created_at
                    } for msg in messages]
                })
        return history
    except Exception as e:
        logger.exception(f"Error fetching chat history: {e}")
        return []
    finally:
        session.close()

def get_posts_history(user_id):
    """Get all posts for a user"""
    session = SessionLocal()
    try:
        posts = session.query(Post).filter(Post.user_id == user_id).order_by(Post.created_at.desc()).all()
        # Always return a list (empty if none)
        return posts if posts else []
    except Exception as e:
        logger.error(f"Error getting posts history: {e}")
        return []
    finally:
        session.close()

def create_post(user_id, topic, content, format, tone, word_count):
    """Create a new post"""
    session = SessionLocal()
    try:
        # Defensive: ensure word_count is int
        try:
            word_count = int(word_count)
        except Exception:
            word_count = 0
        post = Post(
            user_id=user_id,
            topic=topic,
            content=content,
            format=format,
            tone=tone,
            word_count=word_count
        )
        session.add(post)
        session.commit()
        logger.info(f"Post created successfully: {post.id}")
        return post
    except Exception as e:
        session.rollback()
        logger.error(f"Error creating post: {e}")
        return None
    finally:
        session.close()

def update_post(post_id, user_id, topic, content):
    """Update an existing post"""
    session = SessionLocal()
    try:
        post = session.query(Post).filter(Post.id == post_id, Post.user_id == user_id).first()
        if post:
            post.topic = topic
            post.content = content
            session.commit()
            logger.info(f"Post updated successfully: {post_id}")
            return True
        logger.warning(f"Post not found: {post_id}")
        return False
    except Exception as e:
        session.rollback()
        logger.error(f"Error updating post: {e}")
        return False
    finally:
        session.close()

def delete_post(post_id, user_id):
    """Delete a post"""
    session = SessionLocal()
    try:
        post = session.query(Post).filter(Post.id == post_id, Post.user_id == user_id).first()
        if post:
            session.delete(post)
            session.commit()
            logger.info(f"Post deleted successfully: {post_id}")
            return True
        logger.warning(f"Post not found: {post_id}")
        return False
    except Exception as e:
        session.rollback()
        logger.error(f"Error deleting post: {e}")
        return False
    finally:
        session.close()

init_db()