import strawberry

from graphql_app.mutations import Mutation
from graphql_app.queries import Query
from graphql_app.subscriptions import Subscription

schema = strawberry.Schema(query=Query, mutation=Mutation, subscription=Subscription)
