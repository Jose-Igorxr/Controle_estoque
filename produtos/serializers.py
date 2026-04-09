from rest_framework import serializers
from .models import Categoria, Produto, Movimentacao

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    categoria_detalhe = CategoriaSerializer(source='categoria', read_only=True)
    categoria_nome = serializers.ReadOnlyField(source='categoria.nome')

    class Meta:
        model = Produto
        fields = '__all__'

class MovimentacaoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.ReadOnlyField(source='produto.nome')
    usuario_responsavel = serializers.PrimaryKeyRelatedField(read_only=True)
    produto_nome = serializers.CharField(source='produto.nome', read_only=True)
    usuario_nome = serializers.CharField(source='usuario_responsavel.username', read_only=True)

    class Meta:
        model = Movimentacao
        fields = '__all__'