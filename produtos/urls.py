from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, ProdutoViewSet, MovimentacaoViewSet, meu_perfil

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'produtos', ProdutoViewSet)
router.register(r'movimentacoes', MovimentacaoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('usuario-logado/', meu_perfil, name='usuario_logado'),
]