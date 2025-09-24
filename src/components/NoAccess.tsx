export default function NoAccess({ message = 'You do not have access to this page.' }: { message?: string }) {
  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <div className="text-lg font-semibold mb-2">Access restricted</div>
      <div className="text-gray-600">{message}</div>
    </div>
  );
}


