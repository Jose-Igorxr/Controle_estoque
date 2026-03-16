from rest_framework import serializers
from .models import Categoria, Produto, Movimentacao

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    categoria_detalhe = CategoriaSerializer(source='categoria', read_only=True)

    class Meta:
        model = Produto
        fields = '__all__'

class MovimentacaoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.ReadOnlyField(source='produto.nome')

    class Meta:
        model = Movimentacao
        fields = '__all__'