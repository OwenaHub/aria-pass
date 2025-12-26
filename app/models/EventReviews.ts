interface EventReviews extends Model {
    comment: string;
    rating: number;
    isAnonymous: boolean;
    isPublic: boolean;
    user: Pick<User, 'id' | 'name' | 'email'>;
}