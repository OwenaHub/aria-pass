interface User extends Model {
    name: string;
    username: string;
    email: string;
    profilePicture: string;
    biography: string;
    emailVerifiedAt: string;
    accountType: 'user' | 'admin';
    organiserProfile?: OrganiseProfile;
    avatarUrl: string;
}