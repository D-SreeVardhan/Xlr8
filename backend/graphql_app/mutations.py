import strawberry


@strawberry.type
class Mutation:
    @strawberry.mutation
    def acknowledge_alert(self, id: strawberry.ID) -> bool:
        # Placeholder until the alert table is added.
        return bool(id)
