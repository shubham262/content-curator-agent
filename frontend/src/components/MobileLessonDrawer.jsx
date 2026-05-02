import { Drawer } from "antd";
import LessonList from "./LessonList";

const MobileLessonDrawer = ({
	open,
	onClose,
	module,
	lessons,
	activeLessonId,
	onSelect,
}) => (
	<Drawer
		open={open}
		onClose={onClose}
		placement="left"
		width={280}
		closable={false}
		styles={{ body: { padding: 0 }, header: { display: "none" } }}
	>
		<LessonList
			module={module}
			lessons={lessons}
			activeLessonId={activeLessonId}
			onSelect={(id) => {
				onSelect(id);
				onClose();
			}}
		/>
	</Drawer>
);
export default MobileLessonDrawer;
